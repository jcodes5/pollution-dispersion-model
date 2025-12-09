import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, Heart, Share2, TrendingUp } from "lucide-react";

export default function Community() {
  const communityStats = [
    { label: "Active Members", value: "1,200+", icon: Users },
    { label: "Discussions", value: "450+", icon: MessageSquare },
    { label: "Projects", value: "85+", icon: TrendingUp },
    { label: "Contributions", value: "200+", icon: Share2 },
  ];

  const discussionTopics = [
    {
      title: "Best practices for regulatory compliance",
      replies: 23,
      views: 456,
      author: "Sarah Chen",
      category: "Best Practices",
    },
    {
      title: "How to model urban heat island effects",
      replies: 18,
      views: 392,
      author: "James Wilson",
      category: "Advanced",
    },
    {
      title: "Comparing dispersion models for EPA approval",
      replies: 15,
      views: 287,
      author: "Dr. Martinez",
      category: "Research",
    },
    {
      title: "Integration with CALPUFF for complex scenarios",
      replies: 12,
      views: 234,
      author: "Alex Kumar",
      category: "Technical",
    },
  ];

  const communityChannels = [
    {
      name: "GitHub Discussions",
      description: "Ask questions, share ideas, and discuss the project",
      members: "340+",
      url: "https://github.com/jcodes5/pollution-dispersion-model/discussions",
    },
    {
      name: "Discord Server",
      description: "Real-time chat with other users and developers",
      members: "280+",
      url: "#",
    },
    {
      name: "Forum",
      description: "Detailed discussions and troubleshooting threads",
      members: "450+",
      url: "#",
    },
    {
      name: "Twitter/X",
      description: "Updates, tips, and community highlights",
      members: "650+",
      url: "#",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Join Our Community
            </h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl">
              Connect with environmental scientists, engineers, and developers
              working on air quality modeling
            </p>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            {communityStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="w-full py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8">Community Channels</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {communityChannels.map((channel, idx) => (
              <a
                key={idx}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="h-full p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">{channel.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {channel.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {channel.members} members
                    </span>
                    <span className="text-primary font-semibold">→</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="w-full py-12 md:py-16 border-t bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8">Recent Discussions</h2>
          <div className="space-y-4">
            {discussionTopics.map((topic, idx) => (
              <Link key={idx} to="#" className="group block">
                <Card className="p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        by {topic.author}
                      </p>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="text-center">
                        <p className="font-semibold text-foreground">
                          {topic.replies}
                        </p>
                        <p className="text-xs">replies</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">
                          {topic.views}
                        </p>
                        <p className="text-xs">views</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="w-full py-12 md:py-16 border-t">
        <div className="container px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Community Guidelines</h2>
          <div className="space-y-6">
            {[
              {
                title: "Be Respectful",
                description:
                  "Treat all community members with respect and dignity. We welcome diverse perspectives and backgrounds.",
              },
              {
                title: "Share Knowledge",
                description:
                  "Help others learn and grow. Share your experiences, insights, and best practices with the community.",
              },
              {
                title: "No Spam",
                description:
                  "Keep discussions on-topic and relevant. Avoid self-promotion without contributing value.",
              },
              {
                title: "Report Issues",
                description:
                  "Found a bug? Have a feature request? Open an issue on GitHub or discuss it in the forum.",
              },
              {
                title: "Cite Sources",
                description:
                  "When sharing research or external resources, provide proper citations and context.",
              },
              {
                title: "Ask Thoughtful Questions",
                description:
                  "Provide context and relevant details when asking questions to help others help you.",
              },
            ].map((guideline, idx) => (
              <div key={idx} className="border-l-2 border-primary pl-4">
                <h3 className="text-lg font-semibold mb-2">
                  {guideline.title}
                </h3>
                <p className="text-muted-foreground">{guideline.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 border-t bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Heart className="w-10 h-10 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to join the community?
            </h2>
            <p className="text-muted-foreground max-w-md">
              Start participating in discussions, share your projects, and learn
              from other community members.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row pt-4">
              <a
                href="https://github.com/jcodes5/pollution-dispersion-model/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Join GitHub Discussions
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
