import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'SMTP Tester - Professional Email Server Testing Tool';
    const description = searchParams.get('description') || 'Test and validate your SMTP server configuration instantly';
    const provider = searchParams.get('provider') || '';
    const type = searchParams.get('type') || 'default';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: provider ? '48px' : '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                lineHeight: 1.1,
                maxWidth: '900px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>

            {/* Provider Badge */}
            {provider && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {provider}
              </div>
            )}

            {/* Description */}
            <p
              style={{
                fontSize: '28px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '32px',
                maxWidth: '800px',
                lineHeight: 1.3,
              }}
            >
              {description}
            </p>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ color: 'white', fontSize: '20px' }}>Real-time Testing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ color: 'white', fontSize: '20px' }}>Secure & Private</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ color: 'white', fontSize: '20px' }}>Free Forever</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '18px',
                fontWeight: '500',
              }}
            >
              smtp.cban.top
            </span>
          </div>

          {/* Author */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '16px',
              }}
            >
              by Ashik Chapagain
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
