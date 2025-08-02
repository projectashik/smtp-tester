import {
  ArrowLeft,
  CheckCircle,
  Mail,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProviderPageTracker from "@/components/ProviderPageTracker";

// Define supported providers
const providers = {
  gmail: {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    security: "STARTTLS",
    description:
      "Test your Gmail SMTP configuration with our professional testing tool. Verify Gmail email delivery, authentication, and troubleshoot common Gmail SMTP issues.",
    features: [
      "App Password authentication support",
      "OAuth 2.0 compatibility testing",
      "Gmail-specific error diagnostics",
      "Real-time connection monitoring",
    ],
    commonIssues: [
      "Enable 2-factor authentication and use App Passwords",
      "Allow less secure apps (not recommended)",
      "Check Gmail SMTP settings: smtp.gmail.com:587",
      "Verify STARTTLS encryption is enabled",
    ],
  },
  outlook: {
    name: "Outlook/Hotmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    security: "STARTTLS",
    description:
      "Test your Outlook/Hotmail SMTP server configuration. Validate Microsoft email service connectivity and troubleshoot Outlook SMTP authentication issues.",
    features: [
      "Microsoft 365 compatibility",
      "Modern authentication support",
      "Outlook-specific diagnostics",
      "Enterprise email testing",
    ],
    commonIssues: [
      "Use your full email address as username",
      "Enable SMTP authentication in Outlook settings",
      "Check server: smtp-mail.outlook.com:587",
      "Ensure STARTTLS is configured properly",
    ],
  },
  yahoo: {
    name: "Yahoo Mail",
    host: "smtp.mail.yahoo.com",
    port: 587,
    security: "STARTTLS",
    description:
      "Test Yahoo Mail SMTP configuration and validate email delivery. Troubleshoot Yahoo SMTP authentication and connection issues with detailed diagnostics.",
    features: [
      "Yahoo App Password support",
      "Legacy authentication testing",
      "Yahoo-specific error handling",
      "Mail delivery verification",
    ],
    commonIssues: [
      "Generate and use Yahoo App Passwords",
      "Enable less secure apps in Yahoo settings",
      "Verify server settings: smtp.mail.yahoo.com:587",
      "Check STARTTLS encryption configuration",
    ],
  },
  sendgrid: {
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    security: "STARTTLS",
    description:
      "Test SendGrid SMTP API configuration for transactional email delivery. Validate SendGrid authentication and troubleshoot email sending issues.",
    features: [
      "API key authentication testing",
      "Transactional email validation",
      "SendGrid-specific diagnostics",
      "High-volume email testing",
    ],
    commonIssues: [
      'Use "apikey" as username and API key as password',
      "Verify SendGrid API key permissions",
      "Check server: smtp.sendgrid.net:587",
      "Ensure sender identity is verified",
    ],
  },
  mailgun: {
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    security: "STARTTLS",
    description:
      "Test Mailgun SMTP configuration for reliable email delivery. Validate Mailgun authentication and troubleshoot transactional email issues.",
    features: [
      "Domain-based authentication",
      "Mailgun API testing",
      "Delivery tracking validation",
      "Bounce handling verification",
    ],
    commonIssues: [
      "Use your Mailgun domain credentials",
      "Verify domain DNS settings",
      "Check server: smtp.mailgun.org:587",
      "Ensure domain is verified in Mailgun",
    ],
  },
};

type ProviderKey = keyof typeof providers;

interface PageProps {
  params: {
    provider: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(providers).map((provider) => ({
    provider,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const provider = providers[resolvedParams.provider as ProviderKey];

  if (!provider) {
    return {
      title: "Provider Not Found",
    };
  }

  const title = `${provider.name} SMTP Test - Free ${provider.name} Email Server Testing Tool`;
  const description = provider.description;

  return {
    title,
    description,
    keywords: [
      `${provider.name} SMTP test`,
      `${provider.name} email server`,
      `${provider.name} SMTP configuration`,
      `test ${provider.name} email`,
      `${provider.name} SMTP troubleshooting`,
      "email delivery test",
      "SMTP authentication",
    ],
    openGraph: {
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(
          description
        )}&provider=${encodeURIComponent(provider.name)}&type=provider`,
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(
          description
        )}&provider=${encodeURIComponent(provider.name)}&type=provider`,
      ],
    },
  };
}

export default async function ProviderTestPage({ params }: PageProps) {
  const resolvedParams = await params;
  const provider = providers[resolvedParams.provider as ProviderKey];

  if (!provider) {
    notFound();
  }

  return (
    <>
      <ProviderPageTracker provider={resolvedParams.provider} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    SMTP Tester
                  </h1>
                  <p className="text-sm text-gray-600">
                    {provider.name} SMTP Testing
                  </p>
                </div>
              </div>
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">Back to Tester</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Server className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {provider.name} SMTP Testing Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {provider.description}
            </p>

            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-lg"
            >
              <Mail className="h-6 w-6" />
              <span>Test {provider.name} SMTP Now</span>
            </Link>
          </div>

          {/* Provider Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Configuration Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Server className="h-6 w-6 mr-2 text-blue-600" />
                {provider.name} SMTP Configuration
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    SMTP Server:
                  </span>
                  <span className="text-gray-900 font-mono">
                    {provider.host}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Port:</span>
                  <span className="text-gray-900 font-mono">
                    {provider.port}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Security:</span>
                  <span className="text-gray-900 font-mono">
                    {provider.security}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Authentication:
                  </span>
                  <span className="text-gray-900">Required</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-blue-600" />
                Testing Features
              </h2>
              <ul className="space-y-2">
                {provider.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-yellow-600" />
              Common {provider.name} SMTP Issues & Solutions
            </h2>
            <ul className="space-y-3">
              {provider.commonIssues.map((issue, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-700">{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Test Your {provider.name} SMTP Configuration?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Use our professional SMTP testing tool to validate your{" "}
              {provider.name} email server configuration, troubleshoot issues,
              and ensure reliable email delivery.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 text-lg"
            >
              <Mail className="h-6 w-6" />
              <span>Start Testing Now</span>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
