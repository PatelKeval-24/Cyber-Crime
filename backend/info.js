import axios from 'axios'; // 1. Ensure axios is imported

export const getUserAuditData = async (req) => {
    // 1. Get IP Address (Advanced localhost handling)
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Normalize localhost IP for testing
    if (clientIp === '::1' || clientIp === '127.0.0.1' || clientIp?.includes('::ffff:127.0.0.1')) {
        clientIp = '152.59.34.136'; // Fallback to a real IP for testing
    }

    // 2. Detect Device Type
    const ua = req.headers['user-agent'] || "";
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
    const deviceType = isMobile ? "Mobile" : "Laptop/Desktop";

    // API Keys
    const vpnApiKey = 'f03b06ba96c04165a59c4c8babd83a18';

    try { 
        // 3. Parallel API Calls using Promise.allSettled
        const [ipInfo, vpnInfo] = await Promise.allSettled([
            axios.get(`http://ip-api.com/json/${clientIp}?fields=status,message,country,city,isp,org,as,query`),
            axios.get(`https://vpnapi.io/api/${clientIp}?key=${vpnApiKey}`)
        ]);
 
        // Extract Data safely from results
        const geo = ipInfo.status === 'fulfilled' ? ipInfo.value.data : {};
        const vpn = vpnInfo.status === 'fulfilled' ? vpnInfo.value.data : {};

        // 4. Prepare the final merged object
        const auditObject = {
            // FIXED: Added parentheses to the function call
            timestamp: new Date().toISOString(), 
            dateStr: new Date().toDateString(),
            ip: clientIp,
            device: deviceType,
            userAgent: ua,
            location: {
                city: geo.city || "Unknown",
                country: geo.country || "Unknown",
                fullAddress: geo.city && geo.country ? `${geo.city}, ${geo.country}` : "Unknown Location"
            },
            network: {
                isp: geo.isp || "Unknown",
                organization: geo.org || "Unknown",
                as: geo.as || "Unknown"
            },
            security: {
                // Check if vpn.security exists before accessing properties
                isVpn: vpn.security?.vpn || false,
                isProxy: vpn.security?.proxy || false,
                isTor: vpn.security?.tor || false,
                isRelay: vpn.security?.relay || false
            }
        };

        return auditObject;

    } catch (error) {
        // Detailed error logging for debugging
        console.error("Critical Audit Function Error:", error.message);
        
        return { 
            ip: clientIp, 
            device: deviceType, 
            timestamp: new Date().toISOString(),
            error: "Geolocation APIs failed",
            details: error.message 
        };
    }
};