import cron from "node-cron"
import { checkWarrantyExpiry } from "./warranty-check"

cron.schedule("0 0 * * *", async () => {
  await checkWarrantyExpiry()
})