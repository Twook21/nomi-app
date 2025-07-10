import React from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-[var(--nimo-gray)] transition-colors duration-300"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
            Butuh Bantuan?
          </h3>
          <p className="text-[var(--nimo-dark)] mt-3 text-lg">
            Kami siap membantu Anda. Hubungi Customer Service kami melalui salah
            satu kanal di bawah ini.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-[var(--background)] rounded-2xl shadow-xl dark:shadow-none dark:border dark:border-gray-700 p-8 md:p-12 transition-colors duration-300">
          <h4 className="text-2xl font-bold text-center text-[var(--nimo-dark)] mb-8">
            Hubungi Customer Service NIMO
          </h4>
          <div className="space-y-6">
            <a
              href="mailto:support@nimo.app"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[var(--nimo-gray)] hover:border-nimo-yellow transition-all"
            >
              <Mail className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--nimo-dark)]">Email</p>
                <p className="text-[var(--nimo-dark)]">
                  support@nimo.app
                </p>
              </div>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[var(--nimo-gray)] hover:border-nimo-yellow transition-all"
            >
              <MessageSquare className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[var(--nimo-dark)]">
                  WhatsApp
                </p>
                <p className="text-[var(--nimo-dark)]">
                  +62 812-3456-7890
                </p>
              </div>
            </a>
            <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Phone className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Telepon</p>
                <p className="text-gray-600 dark:text-gray-400">
                  (021) 555-0123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
