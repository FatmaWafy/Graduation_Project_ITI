"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Github, Code, ExternalLink, Award } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type ExternalStats = {
  github_repos: number | null;
  leetcode_solved: number | null;
};

type StudentProfile = {
  github_profile: string | null;
  leetcode_profile: string | null;
};

export default function StudentProgress({ studentId }: { studentId: number }) {
  const [externalStats, setExternalStats] = useState<ExternalStats | null>(
    null
  );
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [githubCount, setGithubCount] = useState(0);
  const [leetcodeCount, setLeetcodeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          fetch(
            `http://127.0.0.1:8000/users/students/external-stats/by-student-id/${studentId}/`
          ),
          fetch(`http://127.0.0.1:8000/users/students/by-id/${studentId}/`),
        ]);

        if (!statsRes.ok || !profileRes.ok)
          throw new Error("Failed to fetch data");

        const statsData = await statsRes.json();
        const profileData = await profileRes.json();

        setExternalStats(statsData);
        setStudentProfile({
          github_profile: profileData.github_profile,
          leetcode_profile: profileData.leetcode_profile,
        });
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setExternalStats(null);
        setStudentProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Count-up animation
  useEffect(() => {
    if (!externalStats) return;

    const githubTarget = externalStats.github_repos || 0;
    const leetcodeTarget = externalStats.leetcode_solved || 0;

    const githubInterval = setInterval(() => {
      setGithubCount((prev) => {
        if (prev >= githubTarget) {
          clearInterval(githubInterval);
          return githubTarget;
        }
        return prev + 1;
      });
    }, 30);

    const leetcodeInterval = setInterval(() => {
      setLeetcodeCount((prev) => {
        if (prev >= leetcodeTarget) {
          clearInterval(leetcodeInterval);
          return leetcodeTarget;
        }
        return prev + 1;
      });
    }, 10);

    return () => {
      clearInterval(githubInterval);
      clearInterval(leetcodeInterval);
    };
  }, [externalStats]);

  if (loading)
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-pulse flex flex-col items-center gap-2'>
          <div className='h-24 w-24 bg-[#f0f9ff] rounded-full'></div>
          <div className='h-4 w-32 bg-[#f0f9ff] rounded'></div>
        </div>
      </div>
    );

  const CircleProgress = ({
    value,
    max,
    color,
    icon,
  }: {
    value: number;
    max: number;
    color: string;
    icon: React.ReactNode;
  }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className='relative flex flex-col items-center'>
        <svg viewBox='0 0 36 36' className='w-28 h-28 drop-shadow'>
          <path
            className='text-gray-200 stroke-current'
            d='M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831'
            fill='none'
            strokeWidth='3'
          />
          <path
            className={`${color} stroke-current transition-all duration-1000 ease-out`}
            strokeDasharray={`${percentage}, 100`}
            d='M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831'
            fill='none'
            strokeWidth='3'
            strokeLinecap='round'
          />
          <text
            x='18'
            y='20.5'
            className={`text-xl font-bold ${color.replace("text-", "fill-")}`}
            textAnchor='middle'
          >
            {value}
          </text>
        </svg>
        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-10'>
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='border-[#e6f4ff] bg-gradient-to-br from-[#f0f9ff] to-white shadow-sm overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex flex-col items-center gap-4'>
              <CircleProgress
                value={githubCount}
                max={10}
                color='text-[#2ea043]'
                icon={<Github className='h-16 w-16 text-[#2ea043]' />}
              />
              <div className='flex flex-col items-center gap-1'>
                <div className='flex items-center gap-2 text-base font-medium'>
                  <Github className='h-5 w-5 text-[#2ea043]' />
                  GitHub Repositories
                </div>
                {studentProfile?.github_profile ? (
                  <Link
                    href={studentProfile.github_profile}
                    target='_blank'
                    className='text-sm text-[#007acc] hover:text-[#0062a3] flex items-center gap-1 transition-colors'
                  >
                    View Profile <ExternalLink className='h-3 w-3' />
                  </Link>
                ) : (
                  <span className='text-xs text-muted-foreground'>
                    No GitHub profile linked
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-[#fff0e6] bg-gradient-to-br from-[#fff8f0] to-white shadow-sm overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex flex-col items-center gap-4'>
              <CircleProgress
                value={leetcodeCount}
                max={200}
                color='text-[#ff9a00]'
                icon={<Code className='h-16 w-16 text-[#ff9a00]' />}
              />
              <div className='flex flex-col items-center gap-1'>
                <div className='flex items-center gap-2 text-base font-medium'>
                  <Code className='h-5 w-5 text-[#ff9a00]' />
                  LeetCode Problems Solved
                </div>
                {studentProfile?.leetcode_profile ? (
                  <Link
                    href={`https://leetcode.com/${studentProfile.leetcode_profile}`}
                    target='_blank'
                    className='text-sm text-[#007acc] hover:text-[#0062a3] flex items-center gap-1 transition-colors'
                  >
                    View Profile <ExternalLink className='h-3 w-3' />
                  </Link>
                ) : (
                  <span className='text-xs text-muted-foreground'>
                    No LeetCode profile linked
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className='border-[#e6f4ff] bg-white shadow-sm'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Award className='h-5 w-5 text-[#007acc]' />
            <h3 className='text-lg font-medium'>Coding Activity</h3>
          </div>

          <div className='text-sm text-muted-foreground'>
            <p>This student has completed:</p>
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>{githubCount} GitHub repositories</li>
              <li>{leetcodeCount} LeetCode problems</li>
              <li>
                Total coding activity score: {githubCount * 10 + leetcodeCount}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
