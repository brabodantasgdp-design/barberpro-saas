/**
 * BarberPro notification worker.
 *
 * Deploy as a cron/worker. Provider adapter is deliberately separate:
 * WhatsApp can later use Meta Cloud API, Twilio, Z-API etc.
 * E-mail can later use Resend/Postmark/etc.
 *
 * Worker contract:
 * 1. atomically claim due notification_jobs
 * 2. send via provider adapter
 * 3. mark sent/failed
 * 4. retry failed jobs with bounded attempts
 * 5. unique(appointment_id, channel, template) guarantees idempotency
 */
export type NotificationJob={
 id:string;shop_id:string;appointment_id:string;channel:"whatsapp"|"email";
 template:string;destination:string;scheduled_for:string;attempts:number;
};
export interface NotificationProvider{
 send(job:NotificationJob):Promise<{messageId:string}>;
}
export async function processJob(job:NotificationJob,provider:NotificationProvider){
 if(job.attempts>=5)throw new Error("MAX_ATTEMPTS");
 return provider.send(job);
}
