-- Merge any programs missing from ministries, then drop Program table
INSERT INTO "Ministry" (
  "id",
  "name",
  "slug",
  "description",
  "imageUrl",
  "schedule",
  "location",
  "isFeatured",
  "isPublished",
  "sortOrder",
  "createdAt",
  "updatedAt"
)
SELECT
  'migrated-' || p."slug",
  p."title",
  p."slug",
  p."description",
  p."imageUrl",
  p."schedule",
  p."location",
  p."isFeatured",
  p."isPublished",
  p."sortOrder",
  p."createdAt",
  p."updatedAt"
FROM "Program" p
WHERE NOT EXISTS (
  SELECT 1 FROM "Ministry" m WHERE m."slug" = p."slug"
);

DROP TABLE "Program";
