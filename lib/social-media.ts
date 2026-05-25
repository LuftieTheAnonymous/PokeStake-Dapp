import { Github, Linkedin, Twitter, Globe, Mail, Send, Code2, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SocialMediaType = 'twitter' | 'discord' | 'github' | 'linkedin' | 'website' | 'email' | 'telegram' | 'dev.to' | 'signal';

export interface SocialMediaConfig {
  type: SocialMediaType;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  urlPattern?: string;
}

export const SOCIAL_MEDIA_OPTIONS: Record<SocialMediaType, SocialMediaConfig> = {
  twitter: {
    type: 'twitter',
    label: 'Twitter / X',
    icon: Twitter,
    placeholder: '@username',
    urlPattern: 'https://twitter.com/',
  },
  discord: {
    type: 'discord',
    label: 'Discord',
    icon: Send,
    placeholder: 'username#0000',
  },
  github: {
    type: 'github',
    label: 'GitHub',
    icon: Github,
    placeholder: 'username',
    urlPattern: 'https://github.com/',
  },
  linkedin: {
    type: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'username',
    urlPattern: 'https://linkedin.com/in/',
  },
  website: {
    type: 'website',
    label: 'Website',
    icon: Globe,
    placeholder: 'https://example.com',
  },
  email: {
    type: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'your@email.com',
  },
  telegram: {
    type: 'telegram',
    label: 'Telegram',
    icon: Send,
    placeholder: '@username',
    urlPattern: 'https://t.me/',
  },
  'dev.to': {
    type: 'dev.to',
    label: 'Dev.to',
    icon: Code2,
    placeholder: 'username',
    urlPattern: 'https://dev.to/',
  },
  signal: {
    type: 'signal',
    label: 'Signal',
    icon: Lock,
    placeholder: '+1234567890 or username',
  },
};

export const POPULAR_SOCIAL_MEDIA: SocialMediaType[] = ['twitter', 'discord', 'github', 'linkedin', 'signal'];
export const ALL_SOCIAL_MEDIA: SocialMediaType[] = Object.keys(SOCIAL_MEDIA_OPTIONS) as SocialMediaType[];
