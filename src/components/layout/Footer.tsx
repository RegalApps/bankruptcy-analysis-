
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
    { label: "Support", path: "/support" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Legal Links */}
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:text-foreground"
                asChild
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center md:text-right">
          <p className="text-sm text-muted-foreground">
            ©2025 FileSecureAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
