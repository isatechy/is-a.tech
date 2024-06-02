-- AlterTable
ALTER TABLE "dns_records" ADD COLUMN     "cloudflare_id" TEXT,
ADD COLUMN     "zone_id" TEXT,
ALTER COLUMN "type" SET DEFAULT 'CNAME',
ALTER COLUMN "ttl" SET DEFAULT 1;
