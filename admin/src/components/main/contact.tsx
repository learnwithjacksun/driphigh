import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

const contactInfo = {
  address: "28B Agip Road, Agip Car Park (in front of Agip Company), Port Harcourt, Rivers State, Nigeria",
  phone: "+234 903 174 0688",
  email: "info@driphigh.com",
  whatsapp: "+2349031740688", // WhatsApp number (without + for link, but display with +)
  hours: "Mon - Sat: 9:00 AM - 6:00 PM",
};

export default function Contact() {

  // Using reliable embed format that works without API key
  
  // Simple and reliable embed URL format
  const mapSimpleUrl = `https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // WhatsApp link
  const whatsappLink = `https://wa.me/${contactInfo.whatsapp.replace(/\s/g, "")}`;
  
  // Phone call link
  const phoneLink = `tel:${contactInfo.phone.replace(/\s/g, "")}`;
  
  // Email link
  const emailLink = `mailto:${contactInfo.email}`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="main">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-4">
            <span className="text-xs md:text-sm font-space uppercase tracking-wider text-main">
              Get In Touch
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-main uppercase font-space mb-4">
            Contact Us
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm md:text-base">
            Visit us at our location or reach out through any of our contact channels. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-main text-background rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                  Our Location
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {contactInfo.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-main font-space font-semibold uppercase text-sm mt-3 hover:gap-3 transition-all duration-300"
                >
                  <span>View on Google Maps</span>
                  <MapPin size={16} />
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-main text-background rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                  Phone
                </h3>
                <p className="text-sm md:text-base text-muted mb-3">
                  {contactInfo.phone}
                </p>
                <a
                  href={phoneLink}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-all duration-300"
                >
                  <Phone size={18} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-main text-background rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                  Email
                </h3>
                <p className="text-sm md:text-base text-muted mb-3">
                  {contactInfo.email}
                </p>
                <a
                  href={emailLink}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-main text-main font-space font-semibold uppercase text-sm hover:bg-main hover:text-background transition-all duration-300"
                >
                  <Mail size={18} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                  WhatsApp
                </h3>
                <p className="text-sm md:text-base text-muted mb-3">
                  Chat with us instantly
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-space font-semibold uppercase text-sm hover:bg-[#20BA5A] transition-all duration-300"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4 pt-4 border-t border-line">
              <div className="w-12 h-12 bg-main/10 text-main rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-main uppercase font-space mb-2">
                  Business Hours
                </h3>
                <p className="text-sm md:text-base text-muted">
                  {contactInfo.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Google Maps */}
          <div className="relative h-[400px] md:h-[500px] lg:h-full min-h-[400px] overflow-hidden border border-line rounded-sm bg-secondary">
            <iframe
              src={mapSimpleUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              title="Driphigh Location - Ekom Iman Flyover, Uyo"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

