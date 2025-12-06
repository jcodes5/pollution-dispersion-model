import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {/* Email */}
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">
                For general inquiries and support
              </p>
              <a
                href="mailto:support@dispersionsim.com"
                className="text-primary font-semibold hover:underline"
              >
                support@dispersionsim.com
              </a>
            </Card>

            {/* GitHub */}
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <Github className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">GitHub</h3>
              <p className="text-muted-foreground mb-4">
                Contribute to the project or report issues
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                github.com/dispersionsim
              </a>
            </Card>

            {/* Discord */}
            <Card className="p-6 text-center hover:border-primary/50 transition-colors">
              <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground mb-4">
                Join our community forum for discussions
              </p>
              <a
                href="#"
                className="text-primary font-semibold hover:underline"
              >
                Community Forum
              </a>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-green-600 font-semibold mb-2">
                    ✓ Message sent successfully!
                  </div>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject</option>
                      <option value="bug">Report a Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="support">Support Question</option>
                      <option value="feedback">General Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us more about your message..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 items-start">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Based Globally
                </h3>
                <p className="text-muted-foreground">
                  DispersionSim is a distributed team supporting users
                  worldwide. We're available across multiple time zones and
                  committed to providing timely support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
