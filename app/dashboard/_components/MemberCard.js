"use client";

import { Building2, GraduationCap, Linkedin, Sparkles } from "lucide-react";
import { Avatar } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";

const MAX_SKILLS = 6;

export function MemberCard({ member, mySkills = [], isMe = false, compact = false }) {
  const name = member.name || member.userName || "Student";
  const mine = new Set(mySkills.map((s) => s.toLowerCase()));
  const skills = [...(member.expertise || [])].sort(
    (a, b) => Number(mine.has(b.toLowerCase())) - Number(mine.has(a.toLowerCase()))
  );
  const shared = isMe ? 0 : skills.filter((s) => mine.has(s.toLowerCase())).length;

  return (
    <article className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar src={member.imageURL} name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="flex flex-wrap items-center gap-2 font-semibold">
            <span className="truncate">{name}</span>
            {isMe && <Badge variant="secondary">You</Badge>}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{member.department}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Batch {member.batch}
          </p>
        </div>
      </div>

      {shared > 0 && (
        <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {shared} skill{shared > 1 ? "s" : ""} in common
        </p>
      )}

      {!compact && member.bio && (
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/80">{member.bio}</p>
      )}

      {skills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
          {skills.slice(0, compact ? 3 : MAX_SKILLS).map((skill) => (
            <li
              key={skill}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs",
                mine.has(skill.toLowerCase()) && !isMe
                  ? "bg-success/10 font-medium text-success"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {skill}
            </li>
          ))}
          {skills.length > (compact ? 3 : MAX_SKILLS) && (
            <li className="rounded-full px-2 py-0.5 text-xs text-muted-foreground">
              +{skills.length - (compact ? 3 : MAX_SKILLS)} more
            </li>
          )}
        </ul>
      )}

      {!compact && !isMe && (
        <div className="mt-auto pt-5">
          {member.linkedinProfile ? (
            <a
              href={member.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 hover:text-[#0A66C2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              Connect on LinkedIn
            </a>
          ) : (
            <p className="text-center text-xs text-muted-foreground">No LinkedIn added yet</p>
          )}
        </div>
      )}
    </article>
  );
}
