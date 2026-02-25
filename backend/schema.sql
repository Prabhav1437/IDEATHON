CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    team_name TEXT NOT NULL,
    leader_name TEXT NOT NULL,
    leader_email TEXT NOT NULL,
    team_size INTEGER,
    college TEXT,
    track TEXT,
    project_title TEXT,
    project_description TEXT,
    repo_link TEXT,
    demo_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (leader_email, team_name)
);
