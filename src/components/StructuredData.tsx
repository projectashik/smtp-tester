export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SMTP Tester",
    "description": "Professional SMTP server testing tool for validating email server configurations, authentication, and delivery. Free, secure, and real-time testing for all major email providers.",
    "url": "https://smtp.cban.top",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Real-time SMTP testing",
      "Secure credential handling",
      "Support for all major email providers",
      "Detailed logging and diagnostics",
      "Authentication testing",
      "Email delivery verification",
      "TLS/SSL connection testing"
    ],
    "provider": {
      "@type": "Organization",
      "name": "SMTP Tester",
      "url": "https://smtp.cban.top"
    },
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is SMTP and why do I need to test it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending emails. Testing your SMTP configuration ensures your email server can successfully send emails, authenticate properly, and handle various email scenarios without issues."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to test my SMTP credentials here?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. Your SMTP credentials are processed securely and are never stored on our servers. All testing happens in real-time and your sensitive information is discarded immediately after the test completes."
        }
      },
      {
        "@type": "Question",
        "name": "Which email providers are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support all major email providers including Gmail, Outlook/Hotmail, Yahoo, SendGrid, Mailgun, Amazon SES, Postmark, Mandrill, SparkPost, Mailjet, and any custom SMTP server configuration."
        }
      },
      {
        "@type": "Question",
        "name": "What information do I need to test my SMTP server?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll need your SMTP server hostname, port number, security settings (TLS/SSL), and if authentication is required, your username and password. Most email providers have these settings readily available in their documentation."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
    </>
  );
}
