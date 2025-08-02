import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define guide topics
const guides = {
  "smtp-authentication": {
    title: "SMTP Authentication Guide",
    description:
      "Complete guide to SMTP authentication methods, security protocols, and best practices for secure email delivery.",
    content: {
      introduction:
        "SMTP authentication is crucial for secure email delivery and preventing unauthorized use of email servers.",
      sections: [
        {
          title: "What is SMTP Authentication?",
          content:
            "SMTP authentication verifies the identity of users before allowing them to send emails through an SMTP server. This prevents spam and unauthorized email sending.",
        },
        {
          title: "Common Authentication Methods",
          content:
            "The most common methods include PLAIN, LOGIN, and CRAM-MD5. Modern servers also support OAuth 2.0 for enhanced security.",
        },
        {
          title: "Setting Up Authentication",
          content:
            "Configure your email client with the correct username, password, and authentication method. Use App Passwords for services like Gmail.",
        },
      ],
      tips: [
        "Always use encrypted connections (TLS/SSL) with authentication",
        "Use App Passwords instead of regular passwords when available",
        "Enable two-factor authentication on your email account",
        "Regularly rotate your SMTP credentials",
      ],
    },
  },
  "smtp-ports": {
    title: "SMTP Ports and Security Guide",
    description:
      "Understanding SMTP ports 25, 587, 465, and 2525. Learn which port to use for secure email delivery and troubleshooting.",
    content: {
      introduction:
        "Different SMTP ports serve different purposes and security levels. Choosing the right port is essential for reliable email delivery.",
      sections: [
        {
          title: "Port 25 - Traditional SMTP",
          content:
            "Port 25 is the original SMTP port, primarily used for server-to-server communication. Many ISPs block this port for security reasons.",
        },
        {
          title: "Port 587 - Submission Port (Recommended)",
          content:
            "Port 587 is the standard for email submission with authentication. It supports STARTTLS encryption and is widely supported.",
        },
        {
          title: "Port 465 - SMTPS (Legacy SSL)",
          content:
            "Port 465 uses implicit SSL/TLS encryption. While secure, it's considered legacy. Port 587 with STARTTLS is preferred.",
        },
        {
          title: "Port 2525 - Alternative Submission",
          content:
            "Port 2525 is an alternative to 587, useful when ISPs block standard ports. Supports the same features as port 587.",
        },
      ],
      tips: [
        "Use port 587 with STARTTLS for most email clients",
        "Port 465 is acceptable if 587 is blocked",
        "Avoid port 25 for email client configuration",
        "Test connectivity if emails aren't sending",
      ],
    },
  },
  "smtp-encryption": {
    title: "SMTP Encryption and Security",
    description:
      "Learn about TLS, SSL, and STARTTLS encryption for secure SMTP connections. Protect your email communications from interception.",
    content: {
      introduction:
        "Email encryption protects your messages from interception and ensures secure communication between email servers.",
      sections: [
        {
          title: "STARTTLS - Opportunistic Encryption",
          content:
            "STARTTLS upgrades a plain text connection to encrypted. It's the most common and recommended encryption method for SMTP.",
        },
        {
          title: "SSL/TLS - Implicit Encryption",
          content:
            "SSL/TLS creates an encrypted connection from the start. Used with port 465, it provides strong security but is less flexible.",
        },
        {
          title: "No Encryption - Plain Text",
          content:
            "Unencrypted SMTP sends emails in plain text. This is insecure and should only be used in trusted network environments.",
        },
      ],
      tips: [
        "Always use encryption for email transmission",
        "STARTTLS with port 587 is the modern standard",
        "Verify certificate validity to prevent man-in-the-middle attacks",
        "Use strong authentication alongside encryption",
      ],
    },
  },
  troubleshooting: {
    title: "SMTP Troubleshooting Guide",
    description:
      "Common SMTP errors and solutions. Fix connection timeouts, authentication failures, and email delivery issues.",
    content: {
      introduction:
        "SMTP issues can prevent email delivery. This guide helps diagnose and resolve common problems.",
      sections: [
        {
          title: "Connection Timeouts",
          content:
            "Timeouts occur when the server doesn't respond. Check server address, port, firewall settings, and network connectivity.",
        },
        {
          title: "Authentication Failures",
          content:
            "Authentication errors indicate credential problems. Verify username, password, and authentication method. Use App Passwords if required.",
        },
        {
          title: "TLS/SSL Errors",
          content:
            "Encryption errors suggest certificate or protocol issues. Verify TLS settings, certificate validity, and supported protocols.",
        },
        {
          title: "Relay Access Denied",
          content:
            "Relay errors occur when the server rejects your email. Ensure authentication is enabled and credentials are correct.",
        },
      ],
      tips: [
        "Test with our SMTP tester to identify issues quickly",
        "Check server logs for detailed error information",
        "Verify DNS settings and server reachability",
        "Contact your email provider if problems persist",
      ],
    },
  },
};

type GuideKey = keyof typeof guides;

interface PageProps {
  params: {
    topic: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(guides).map((topic) => ({
    topic,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const guide = guides[params.topic as GuideKey];

  if (!guide) {
    return {
      title: "Guide Not Found",
    };
  }

  const title = `${guide.title} | SMTP Tester`;
  const description = guide.description;

  return {
    title,
    description,
    keywords: [
      "SMTP guide",
      "email server setup",
      "SMTP configuration",
      "email troubleshooting",
      "SMTP security",
      "email authentication",
      "SMTP ports",
      "email encryption",
    ],
    openGraph: {
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          guide.title
        )}&description=${encodeURIComponent(description)}&type=guide`,
      ],
    },
    twitter: {
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(
          guide.title
        )}&description=${encodeURIComponent(description)}&type=guide`,
      ],
    },
  };
}

export default function GuidePage({ params }: PageProps) {
  const guide = guides[params.topic as GuideKey];

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SMTP Guide</h1>
                <p className="text-sm text-gray-600">
                  Professional Email Server Documentation
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {guide.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {guide.description}
          </p>
        </div>

        {/* Content */}
        <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              {guide.content.introduction}
            </p>
          </div>

          {/* Sections */}
          <div className="p-8 space-y-8">
            {guide.content.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="p-8 bg-blue-50 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-blue-600" />
              Pro Tips
            </h2>
            <ul className="space-y-3">
              {guide.content.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Test Your SMTP Configuration?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Apply what you've learned with our professional SMTP testing tool.
            Get real-time diagnostics and troubleshoot email issues instantly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 text-lg"
          >
            <Mail className="h-6 w-6" />
            <span>Test SMTP Now</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
