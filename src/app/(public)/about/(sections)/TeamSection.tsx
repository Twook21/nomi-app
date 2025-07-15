import React from "react";
import Image from "next/image";

const TeamSection = () => {
  return (
    <section id="team" className="py-20 md:py-28 bg-[var(--nimo-gray)]">
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          Tim di Balik <span className="text-nimo-yellow">NOMI</span>
        </h2>
        <p className="text-lg leading-relaxed mb-12 text-gray-700">
          Kami adalah tim kecil yang terdiri dari para pegiat teknologi,
          pencinta kuliner, dan aktivis lingkungan dengan satu misi besar:
          mengubah cara kita memandang dan mengelola makanan.
        </p>
        <div className="flex justify-center items-center flex-wrap gap-8">
          {/* Ganti dengan data tim Anda */}
          <div className="text-center group">
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-nimo-yellow/50 group-hover:border-nimo-yellow transition-all duration-300 shadow-lg mx-auto">
              <Image
                src="/images/team-placeholder-1.jpg"
                alt="Foto Tim 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h5 className="mt-4 font-bold text-lg">Nama Anggota 1</h5>
            <p className="text-nimo-yellow">Jabatan</p>
          </div>
          <div className="text-center group">
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-nimo-yellow/50 group-hover:border-nimo-yellow transition-all duration-300 shadow-lg mx-auto">
              <Image
                src="/images/team-placeholder-2.jpg"
                alt="Foto Tim 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h5 className="mt-4 font-bold text-lg">Nama Anggota 2</h5>
            <p className="text-nimo-yellow">Jabatan</p>
          </div>
          <div className="text-center group">
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-nimo-yellow/50 group-hover:border-nimo-yellow transition-all duration-300 shadow-lg mx-auto">
              <Image
                src="/images/team-placeholder-3.jpg"
                alt="Foto Tim 3"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h5 className="mt-4 font-bold text-lg">Nama Anggota 3</h5>
            <p className="text-nimo-yellow">Jabatan</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
