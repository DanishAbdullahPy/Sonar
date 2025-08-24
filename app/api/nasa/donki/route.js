export async function GET(request) {
  const apiKey = process.env.NASA_API_KEY;
  const { searchParams } = new URL(request.url);
  const eventType = searchParams.get('type'); // Can be multiple types comma-separated or 'notifications'
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const location = searchParams.get('location'); // For IPS events
  const catalog = searchParams.get('catalog'); // For IPS events

  // Default to past 7 days if no dates provided
  const now = new Date();
  const defaultEndDate = now.toISOString().slice(0, 10);
  const defaultStartDate = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const finalStartDate = startDate || defaultStartDate;
  const finalEndDate = endDate || defaultEndDate;

  try {
    let allEvents = [];
    
    // Handle notifications separately
    if (eventType === 'notifications' || !eventType) {
      const notificationUrl = `https://api.nasa.gov/DONKI/notifications?startDate=${finalStartDate}&endDate=${finalEndDate}&type=all&api_key=${apiKey}`;
      const notificationResponse = await fetch(notificationUrl);
      if (notificationResponse.ok) {
        const notifications = await notificationResponse.json();
        if (Array.isArray(notifications)) {
          allEvents = [...allEvents, ...notifications.map(n => ({
            ...n,
            eventType: 'notification',
            id: n.notificationID,
            time: n.time21_5,
            type: n.type
          }))];
        }
      }
    }
    
    // Handle multiple event types if specified
    if (eventType && eventType !== 'notifications') {
      const eventTypes = eventType.split(',');
      
      for (const type of eventTypes) {
        if (type === 'notifications') continue; // Already handled above
        
        let url;
        
        // Special handling for different event types
        if (type === 'IPS' && location) {
          url = `https://api.nasa.gov/DONKI/IPS?startDate=${finalStartDate}&endDate=${finalEndDate}&location=${location}&catalog=${catalog || 'ALL'}&api_key=${apiKey}`;
        } else if (type === 'CMEAnalysis') {
          url = `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${apiKey}`;
        } else {
          url = `https://api.nasa.gov/DONKI/${type}?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${apiKey}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            allEvents = [...allEvents, ...data.map(event => ({
              ...event,
              eventType: type
            }))];
          }
        }
      }
    }
    
    // Sort events by date (newest first)
    allEvents.sort((a, b) => {
      const dateA = new Date(a.time21_5 || a.startTime || a.time || 0);
      const dateB = new Date(b.time21_5 || b.startTime || b.time || 0);
      return dateB - dateA;
    });
    
    return new Response(JSON.stringify(allEvents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      ok: false,
      error: 'NASA DONKI API failed',
      detail: err.message,
    }), { status: 500 });
  }
}