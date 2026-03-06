import {
  EmailIcon,
  ExpressIcon,
  GitHubIcon,
  JavaScriptIcon,
  LinkedInOutlineIcon,
  MongoDBIcon,
  NodeIcon,
  ReactIcon,
  ReactRouterIcon,
  ReduxToolkitIcon,
  TypeScriptIcon,
} from "@/components/icons";

export interface ISocial {
  Icon: React.ComponentType;
  label: string;
  href: string;
}

export interface ISkill {
  Icon: React.ComponentType;
  label: string;
  key: string;
}

export const SOCIAL: ISocial[] = [
  {
    href: "https://www.linkedin.com/in/lahcen-alhiane-61217239a/",
    Icon: LinkedInOutlineIcon,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/onepiece-coding",
    Icon: GitHubIcon,
    label: "GitHub",
  },
  {
    href: "mailto:onepiece.codingpar@gmail.com",
    Icon: EmailIcon,
    label: "Email",
  },
];

export const SKILLS: ISkill[] = [
  {
    key: "react",
    label: "React",
    Icon: ReactIcon,
  },
  {
    key: "typescript",
    label: "TypeScript",
    Icon: TypeScriptIcon,
  },
  {
    key: "router",
    label: "React Router",
    Icon: ReactRouterIcon,
  },
  {
    key: "rtk",
    label: "Redux Toolkit",
    Icon: ReduxToolkitIcon,
  },
  {
    key: "node",
    label: "Node.js",
    Icon: NodeIcon,
  },
  {
    key: "mongodb",
    label: "MongoDB",
    Icon: MongoDBIcon,
  },
  {
    key: "express",
    label: "Express.js",
    Icon: ExpressIcon,
  },
  {
    key: "js",
    label: "JavaScript",
    Icon: JavaScriptIcon,
  },
];
