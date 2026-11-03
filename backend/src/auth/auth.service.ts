import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
      },
    });

    await this.seedDefaultCategories(user.id);

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      user: this.publicUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      user: this.publicUser(user),
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!stored) {
      throw new UnauthorizedException('Refresh token revogado ou expirado');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.email);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Resposta genérica para não revelar existência do e-mail
    const generic = {
      message:
        'Se o e-mail existir, um token de recuperação foi gerado. Em ambiente acadêmico o token é retornado na resposta.',
      resetToken: null as string | null,
    };

    if (!user) {
      return generic;
    }

    const raw = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(raw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    return { ...generic, resetToken: raw };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Token de recuperação inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    return this.publicUser(user);
  }

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const decoded = this.jwt.decode(refreshToken) as { exp: number };
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(decoded.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private publicUser(user: { id: string; name: string; email: string; createdAt: Date }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async seedDefaultCategories(userId: string) {
    const defaults = [
      { name: 'Salário', kind: 'INCOME' as const, color: '#10B981', icon: 'wallet' },
      { name: 'Freelance', kind: 'INCOME' as const, color: '#34D399', icon: 'briefcase' },
      { name: 'Outros ganhos', kind: 'INCOME' as const, color: '#6EE7B7', icon: 'plus' },
      { name: 'Moradia', kind: 'EXPENSE' as const, color: '#EF4444', icon: 'home' },
      { name: 'Alimentação', kind: 'EXPENSE' as const, color: '#F59E0B', icon: 'utensils' },
      { name: 'Transporte', kind: 'EXPENSE' as const, color: '#3B82F6', icon: 'car' },
      { name: 'Lazer', kind: 'EXPENSE' as const, color: '#8B5CF6', icon: 'gamepad' },
      { name: 'Saúde', kind: 'EXPENSE' as const, color: '#EC4899', icon: 'heart' },
      { name: 'Educação', kind: 'EXPENSE' as const, color: '#06B6D4', icon: 'book' },
      { name: 'Compras', kind: 'EXPENSE' as const, color: '#F97316', icon: 'shopping' },
      { name: 'Contas', kind: 'EXPENSE' as const, color: '#64748B', icon: 'file' },
      { name: 'Outros', kind: 'EXPENSE' as const, color: '#6B7280', icon: 'more' },
    ];

    await this.prisma.category.createMany({
      data: defaults.map((c) => ({ ...c, userId, isSystem: true })),
    });
  }
}
