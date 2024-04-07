import { createAppRoute } from '@seventy-seven/jobs'
import { jobsClient } from '@seventy-seven/jobs/jobsClient'

// import '@/jobs'
import '@seventy-seven/jobs'

//this route is used to send and receive data with Trigger.dev
export const { POST, dynamic } = createAppRoute(jobsClient)

//uncomment this to set a higher max duration (it must be inside your plan limits). Full docs: https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration
//export const maxDuration = 60;
