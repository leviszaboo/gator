-- Create users table
CREATE TABLE "apps" (
    "user_id" VARCHAR(255) NOT NULL,
    "app_name" VARCHAR(255) NOT NULL,
    "app_id" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255),
    "status" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "task_id" VARCHAR(255),

    CONSTRAINT "apps_pkey" PRIMARY KEY ("app_id")
);
