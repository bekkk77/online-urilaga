import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitation, emailInvites } = body;

    console.log(`[API/send-invites] Sending ${emailInvites?.length || 0} invites for "${invitation?.title}"`);

    if (!emailInvites || emailInvites.length === 0) {
      return NextResponse.json(
        { success: false, error: "No email addresses provided." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[API/send-invites] RESEND_API_KEY is missing");
      return NextResponse.json(
        { success: false, error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const fromEmail = "onboarding@resend.dev";
    const fromName = invitation.host || "Урилга";

    const emailPromises = emailInvites.map(
      async (invite: { email: string; link: string }) => {
        try {
          const { data, error } = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: [invite.email],
            subject: `✨ Танд урилга ирлээ: ${invitation.title}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f7fa; }
                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 60px 40px; text-align: center; color: white; }
                .header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; }
                .content { padding: 40px; }
                .event-title { font-size: 24px; font-weight: 700; color: #4f46e5; margin-bottom: 20px; text-align: center; }
                .description { color: #4b5563; font-size: 16px; margin-bottom: 30px; text-align: center; }
                .details-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-bottom: 35px; }
                .detail-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
                .detail-item:last-child { margin-bottom: 0; }
                .detail-icon { font-size: 20px; margin-right: 15px; min-width: 25px; }
                .detail-text { font-size: 15px; font-weight: 600; color: #334155; }
                .detail-label { font-size: 13px; color: #64748b; font-weight: 400; margin-bottom: 2px; }
                .cta-container { text-align: center; margin-top: 10px; }
                .cta-button { background-color: #4f46e5; color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 16px; display: inline-block; transition: all 0.2s; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
                .footer { padding: 30px; text-align: center; border-top: 1px solid #f1f5f9; background-color: #fafbfd; }
                .footer p { color: #94a3b8; font-size: 13px; margin: 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Танд урилга ирлээ</h1>
                </div>
                
                <div class="content">
                  <h2 class="event-title">${invitation.title}</h2>
                  
                  ${invitation.description ? `<p class="description">${invitation.description}</p>` : '<p class="description">Таныг энэхүү арга хэмжээнд хүрэлцэн ирэхийг урьж байна.</p>'}
                  
                  <div class="details-card">
                    <div class="detail-item">
                      <div class="detail-icon">📅</div>
                      <div>
                        <div class="detail-label">Огноо</div>
                        <div class="detail-text">${invitation.date}</div>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-icon">⏰</div>
                      <div>
                        <div class="detail-label">Цаг</div>
                        <div class="detail-text">${invitation.time}</div>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-icon">📍</div>
                      <div>
                        <div class="detail-label">Байршил</div>
                        <div class="detail-text">${invitation.location}</div>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-icon">👤</div>
                      <div>
                        <div class="detail-label">Зохион байгуулагч</div>
                        <div class="detail-text">${invitation.host}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="cta-container">
                    <a href="${invite.link}" class="cta-button">
                      Урилгад хариулах
                    </a>
                  </div>
                </div>
                
                <div class="footer">
                  <p>Энэхүү мэйл нь "Online Invitation" системээс илгээгдсэн болно.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          });

          if (error) {
            console.error(`[API/send-invites] Failed to send to ${invite.email}:`, error);
            return {
              success: false,
              email: invite.email,
              error: error.message || "Resend error",
            };
          }

          return { success: true, email: invite.email, data };
        } catch (err) {
          console.error(`[API/send-invites] Catch error for ${invite.email}:`, err);
          return {
            success: false,
            email: invite.email,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      },
    );

    const results = await Promise.all(emailPromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    if (successful.length === 0) {
      const firstError = failed[0]?.error || "Unknown error";
      return NextResponse.json({
        success: false,
        error: `Мэйл илгээхэд алдаа гарлаа: ${firstError}`,
        failedCount: failed.length,
        results,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      sentCount: successful.length,
      failedCount: failed.length,
      results,
    });
  } catch (error) {
    console.error("[API/send-invites] Main catch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process invitation requests." },
      { status: 500 },
    );
  }
}
