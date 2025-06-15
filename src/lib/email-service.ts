// خدمة الإيميل الحقيقية باستخدام EmailJS
// Real Email Service using EmailJS

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  verification_code: string;
  message: string;
  language: string;
}

class EmailService {
  private static instance: EmailService;
  private emailJS: any = null;
  private isInitialized = false;

  // إعدادات EmailJS (يجب تكوينها في بيئة الإنتاج)
  private config: EmailJSConfig = {
    serviceId: 'service_admin_recovery', // يجب إنشاؤه في EmailJS
    templateId: 'template_verification', // يجب إنشاؤه في EmailJS
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY' // يجب الحصول عليه من EmailJS
  };

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * تهيئة خدمة EmailJS
   * Initialize EmailJS service
   */
  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering
        return false;
      }

      // تحميل EmailJS ديناميكياً
      if (!this.emailJS) {
        const emailjs = await import('@emailjs/browser');
        this.emailJS = emailjs;
      }

      // تهيئة EmailJS
      this.emailJS.init(this.config.publicKey);
      this.isInitialized = true;
      
      console.log('📧 EmailJS initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      return false;
    }
  }

  /**
   * إرسال رمز التحقق عبر الإيميل
   * Send verification code via email
   */
  async sendVerificationCode(
    email: string, 
    code: string, 
    lang: 'ar' | 'en' = 'ar'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // التحقق من التهيئة
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('EmailJS not initialized');
        }
      }

      // إعداد بيانات الإيميل
      const emailData: EmailData = {
        to_email: email,
        to_name: lang === 'ar' ? 'مدير النظام' : 'System Administrator',
        subject: lang === 'ar' 
          ? 'رمز التحقق - استعادة كلمة مرور الأدمن'
          : 'Verification Code - Admin Password Recovery',
        verification_code: code,
        message: this.generateEmailMessage(code, lang),
        language: lang
      };

      // إرسال الإيميل
      const result = await this.emailJS.send(
        this.config.serviceId,
        this.config.templateId,
        emailData
      );

      console.log('📧 Email sent successfully:', result.text);
      
      return {
        success: true,
        messageId: result.text
      };

    } catch (error) {
      console.error('Email sending failed:', error);
      
      // في حالة فشل EmailJS، استخدم الطريقة البديلة
      return await this.fallbackEmailSend(email, code, lang);
    }
  }

  /**
   * إنشاء محتوى الإيميل
   * Generate email message content
   */
  private generateEmailMessage(code: string, lang: 'ar' | 'en'): string {
    if (lang === 'ar') {
      return `
مرحباً،

تم طلب استعادة كلمة مرور حساب المدير لنظام اختبارات الألوان للكشف عن المخدرات.

رمز التحقق الخاص بك هو: ${code}

هذا الرمز صالح لمدة 5 دقائق فقط.

تنبيه أمني:
• لا تشارك هذا الرمز مع أي شخص
• إذا لم تطلب هذا الرمز، تجاهل هذه الرسالة
• تأكد من أنك تستخدم الموقع الرسمي

مع تحيات،
فريق نظام اختبارات الألوان
وزارة الصحة - المملكة العربية السعودية
      `;
    } else {
      return `
Hello,

A password recovery request has been made for the admin account of the Color Testing System for Drug Detection.

Your verification code is: ${code}

This code is valid for 5 minutes only.

Security Warning:
• Do not share this code with anyone
• If you didn't request this code, ignore this message
• Make sure you're using the official website

Best regards,
Color Testing System Team
Ministry of Health - Saudi Arabia
      `;
    }
  }

  /**
   * طريقة بديلة لإرسال الإيميل (mailto)
   * Fallback email method (mailto)
   */
  private async fallbackEmailSend(
    email: string, 
    code: string, 
    lang: 'ar' | 'en'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const subject = encodeURIComponent(
        lang === 'ar' 
          ? 'رمز التحقق - استعادة كلمة مرور الأدمن'
          : 'Verification Code - Admin Password Recovery'
      );
      
      const body = encodeURIComponent(this.generateEmailMessage(code, lang));
      
      // فتح تطبيق الإيميل الافتراضي
      const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
      
      if (typeof window !== 'undefined') {
        window.open(mailtoLink, '_blank');
      }

      console.log('📧 Fallback: Email client opened');
      
      return {
        success: true,
        messageId: 'fallback_mailto'
      };

    } catch (error) {
      console.error('Fallback email failed:', error);
      return {
        success: false,
        error: 'All email methods failed'
      };
    }
  }

  /**
   * التحقق من صحة الإيميل
   * Validate email address
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * تكوين إعدادات EmailJS
   * Configure EmailJS settings
   */
  configure(config: Partial<EmailJSConfig>): void {
    this.config = { ...this.config, ...config };
    this.isInitialized = false; // إعادة التهيئة مطلوبة
  }
}

export const emailService = EmailService.getInstance();

// إعدادات EmailJS للإنتاج
// EmailJS configuration for production
export const EMAILJS_CONFIG = {
  // يجب الحصول على هذه القيم من https://www.emailjs.com/
  SERVICE_ID: 'service_admin_recovery',
  TEMPLATE_ID: 'template_verification',
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  
  // قالب الإيميل المطلوب في EmailJS:
  // Required email template in EmailJS:
  /*
  Subject: {{subject}}
  
  To: {{to_name}} <{{to_email}}>
  
  {{message}}
  
  Verification Code: {{verification_code}}
  
  Language: {{language}}
  */
};

// دليل الإعداد
// Setup Guide
export const SETUP_GUIDE = {
  ar: `
إعداد خدمة الإيميل:

1. إنشاء حساب في EmailJS:
   - اذهب إلى https://www.emailjs.com/
   - أنشئ حساب جديد

2. إعداد الخدمة:
   - أضف خدمة إيميل (Gmail, Outlook, إلخ)
   - احصل على Service ID

3. إنشاء القالب:
   - أنشئ قالب جديد
   - استخدم المتغيرات: {{to_email}}, {{subject}}, {{message}}, {{verification_code}}
   - احصل على Template ID

4. الحصول على Public Key:
   - اذهب إلى Account > API Keys
   - انسخ Public Key

5. تحديث الإعدادات:
   - حدث EMAILJS_CONFIG في هذا الملف
   - أو استخدم متغيرات البيئة
  `,
  en: `
Email Service Setup:

1. Create EmailJS Account:
   - Go to https://www.emailjs.com/
   - Create a new account

2. Setup Service:
   - Add email service (Gmail, Outlook, etc.)
   - Get Service ID

3. Create Template:
   - Create new template
   - Use variables: {{to_email}}, {{subject}}, {{message}}, {{verification_code}}
   - Get Template ID

4. Get Public Key:
   - Go to Account > API Keys
   - Copy Public Key

5. Update Configuration:
   - Update EMAILJS_CONFIG in this file
   - Or use environment variables
  `
};
