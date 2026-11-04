-- Traductions : un champ JSON par table dont le contenu est rédigé.
--
-- Forme attendue :  { "en": { "title": "…", "bio": "…" } }
-- Un champ absent, vide, ou un `i18n` nul retombe sur le français : la
-- colonne est donc nullable et sans valeur par défaut, et aucune ligne
-- existante n'a besoin d'être touchée.
--
-- Migration purement ADDITIVE : elle n'écrit, ne déplace ni ne supprime
-- aucune donnée. Elle peut être rejouée sans risque grâce à
-- `IF NOT EXISTS`.

ALTER TABLE "Profile"     ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Project"     ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Skill"       ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Experience"  ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Service"     ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "SocialPost"  ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "Post"        ADD COLUMN IF NOT EXISTS "i18n" JSONB;
ALTER TABLE "FAQ"         ADD COLUMN IF NOT EXISTS "i18n" JSONB;
