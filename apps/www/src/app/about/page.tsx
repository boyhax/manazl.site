import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Manazl | Your Gateway to Oman',
  description: 'Learn about Manazl, your trusted platform for exploring and booking properties across Oman.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] mb-16">
        <Image
          src="https://platinumlist.net/guide/wp-content/uploads/2024/07/oman-mutrah-corniche-view-86zs53wk12ap9r56.jpg"
          alt="Oman Landscape"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">About Manazl</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your trusted gateway to discovering Oman&apos;s finest properties and experiences
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                At Manazl, we&apos;re dedicated to connecting travelers with authentic Omani hospitality experiences. Our platform makes it easy to discover and book unique properties across the Sultanate of Oman.
              </p>
              <p className="text-gray-600">
                We work closely with local property owners to ensure high-quality accommodations while promoting sustainable tourism that benefits local communities.
              </p>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image
                src="https://media.istockphoto.com/id/1084217578/photo/grand-mosue-muscat.jpg?s=612x612&w=0&k=20&c=F4FsUMWqlVJg2XHUp6xEiifdE_I3ait_sCXG6DmRIVc="
                alt="Manazl Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Trust",
                description: "Building trust through transparency and reliable service",
                icon: "🤝"
              },
              {
                title: "Quality",
                description: "Maintaining high standards in property listings and customer service",
                icon: "⭐"
              },
              {
                title: "Community",
                description: "Supporting local communities and promoting cultural exchange",
                icon: "🏘️"
              },
            ].map((value, key) => (
              <div key={key} className="p-6 rounded-lg bg-white shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-12">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Said Alhajri",
                role: "Founder & CEO",
                image: "/images/team/ceo.jpg"
              },
              
              // Add more team members as needed
            ].map((member) => (
              <div key={member.name} className="text-center">
                {/* <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div> */}
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center py-20">
          <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-8">Have questions? We&apos;d love to hear from you.</p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-base font-medium text-white bg-primary hover:bg-primary/90 transition"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}