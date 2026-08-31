/** Shape of the fields this site consumes from the GitHub REST repo payload. */
export interface GithubRepo {
  readonly id: number;
  readonly name: string;
  readonly full_name: string;
  readonly html_url: string;
  readonly description: string | null;
  readonly homepage: string | null;
  readonly language: string | null;
  readonly topics: readonly string[];
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly private: boolean;
  readonly fork: boolean;
  readonly archived: boolean;
  readonly created_at: string;
  readonly pushed_at: string;
}

/** A repo merged with the locally authored copy that GitHub descriptions lack. */
export interface Project {
  readonly id: number;
  readonly name: string;
  /** Display title — the curated one when present, otherwise the repo name. */
  readonly title: string;
  readonly summary: string;
  readonly stack: readonly string[];
  readonly language: string | null;
  readonly repoUrl: string;
  readonly liveUrl: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly pushedAt: string;
  readonly year: string;
}
