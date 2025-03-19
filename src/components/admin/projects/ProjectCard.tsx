
import { Project } from "@/hooks/use-projects";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Github, 
  ExternalLink, 
  Edit, 
  Trash, 
  Image
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  refetch: () => void;
  forwardedRef: React.Ref<HTMLDivElement>;
}

export function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
  refetch,
  forwardedRef
}: ProjectCardProps) {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      ref={forwardedRef}
    >
      <Card className="group overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              <Image className="h-8 w-8" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-red-600"
              onClick={() => onDelete(project)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {project.title}
          </CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies.map((tech, i) => (
                <Badge key={i} variant="secondary" className="bg-secondary/20">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-4 pt-2">
          <div className="flex space-x-2">
            {project.github_url && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => window.open(project.github_url, "_blank")}
              >
                <Github className="h-4 w-4" />
              </Button>
            )}
            {project.demo_url && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => window.open(project.demo_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
