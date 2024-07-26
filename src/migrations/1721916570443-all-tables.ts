import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllTables1721916570443 implements MigrationInterface {
  name = 'AllTables1721916570443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."gender_enum" AS ENUM ('F', 'M');`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."verifications_verification_type_enum" AS ENUM ('signup_email', 'signup_mobile', 'login_email', 'login_mobile');`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tour_status_enum" AS ENUM ('released','accepted','rejected','published','unpublished','started','finished','canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "leaders" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accepted" boolean NOT NULL DEFAULT false, "mobile" character varying NOT NULL, "stars" double precision NOT NULL DEFAULT '0', "intro" text, "user_id" integer, CONSTRAINT "REL_0c724f020fd0471f32c024cde7" UNIQUE ("user_id"), CONSTRAINT "PK_6035d2826e63f39b50a34901d36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "leader_rates" ("id" SERIAL NOT NULL, "rate" real NOT NULL, "user_id" integer, "leader_id" integer, CONSTRAINT "PK_74adacfa03e14538ca31c40625d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tour_attendees" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "national_id" character varying NOT NULL, "mobile" character varying NOT NULL, "email" character varying, "gender" "public"."gender_enum" NOT NULL, "reservation_id" integer, CONSTRAINT "PK_dd8a44a2c53f83bbdfa64baa7c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tour_reservations" ("id" SERIAL NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "tour_id" integer, "user_id" integer, CONSTRAINT "PK_7610854b684d3adbdc8ae47ee55" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "verifications" ("id" SERIAL NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "verification_code" character varying NOT NULL, "retry_count" integer NOT NULL DEFAULT '0', "verification_type" "public"."verifications_verification_type_enum" NOT NULL, "userId" integer, CONSTRAINT "PK_2127ad1b143cf012280390b01d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying, "last_name" character varying, "gender" "public"."gender_enum" NOT NULL, "email" character varying, "password" character varying, "salt" character varying, "roles" character varying, "is_active" boolean NOT NULL DEFAULT true, "mobile_verified" boolean NOT NULL DEFAULT false, "avatar" character varying NOT NULL DEFAULT '', "mobile" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_d376a9f93bba651f32a2c03a7d3" UNIQUE ("mobile"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "images" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "tour_id" integer, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tours" ("id" SERIAL NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "tour_name" character varying NOT NULL, "tour_description" text NOT NULL DEFAULT '', "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "finish_date" TIMESTAMP WITH TIME ZONE NOT NULL, "price" integer NOT NULL, "tour_attendance" integer NOT NULL DEFAULT '1', "origin_province" character varying NOT NULL, "origin_city" character varying NOT NULL, "destination_province" character varying NOT NULL, "destination_city" character varying NOT NULL, "status" "public"."tour_status_enum" NOT NULL DEFAULT 'released', "timeline" json NOT NULL DEFAULT '[]', "rejection_comment" character varying, "owner_id" integer, "leader_id" integer, CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tours_tags" ("toursId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_0ab11aced59025fda2262d3436a" PRIMARY KEY ("toursId", "tagsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f50757bcd9d660f2d709af81ab" ON "tours_tags" ("toursId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_323f5a2f541475b0cf9c341c8d" ON "tours_tags" ("tagsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "leaders" ADD CONSTRAINT "FK_0c724f020fd0471f32c024cde75" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leader_rates" ADD CONSTRAINT "FK_3e0a0132caf177b48973a56e695" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leader_rates" ADD CONSTRAINT "FK_fd9bde53f0a46f817a56acef089" FOREIGN KEY ("leader_id") REFERENCES "leaders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_attendees" ADD CONSTRAINT "FK_c04f18d84a4b25798eaa2bb957c" FOREIGN KEY ("reservation_id") REFERENCES "tour_reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_reservations" ADD CONSTRAINT "FK_61b3bb0d8df13fc50a5c1dca34c" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_reservations" ADD CONSTRAINT "FK_2d91eb0e8228a6d30c01cab89a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" ADD CONSTRAINT "FK_e6a542673f9abc1f67e5f32abaf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" ADD CONSTRAINT "FK_ca4637e100ebe56837e3642bd65" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours" ADD CONSTRAINT "FK_315aa1d0fab1bc3201d79b35d7a" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours" ADD CONSTRAINT "FK_3520afd2f01375633b1d4b34516" FOREIGN KEY ("leader_id") REFERENCES "leaders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours_tags" ADD CONSTRAINT "FK_f50757bcd9d660f2d709af81ab3" FOREIGN KEY ("toursId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours_tags" ADD CONSTRAINT "FK_323f5a2f541475b0cf9c341c8d4" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tours_tags" DROP CONSTRAINT "FK_323f5a2f541475b0cf9c341c8d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours_tags" DROP CONSTRAINT "FK_f50757bcd9d660f2d709af81ab3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours" DROP CONSTRAINT "FK_3520afd2f01375633b1d4b34516"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tours" DROP CONSTRAINT "FK_315aa1d0fab1bc3201d79b35d7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "images" DROP CONSTRAINT "FK_ca4637e100ebe56837e3642bd65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verifications" DROP CONSTRAINT "FK_e6a542673f9abc1f67e5f32abaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_reservations" DROP CONSTRAINT "FK_2d91eb0e8228a6d30c01cab89a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_reservations" DROP CONSTRAINT "FK_61b3bb0d8df13fc50a5c1dca34c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_attendees" DROP CONSTRAINT "FK_c04f18d84a4b25798eaa2bb957c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leader_rates" DROP CONSTRAINT "FK_fd9bde53f0a46f817a56acef089"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leader_rates" DROP CONSTRAINT "FK_3e0a0132caf177b48973a56e695"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leaders" DROP CONSTRAINT "FK_0c724f020fd0471f32c024cde75"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_323f5a2f541475b0cf9c341c8d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f50757bcd9d660f2d709af81ab"`,
    );
    await queryRunner.query(`DROP TABLE "tours_tags"`);
    await queryRunner.query(`DROP TABLE "tours"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "images"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "verifications"`);
    await queryRunner.query(`DROP TABLE "tour_reservations"`);
    await queryRunner.query(`DROP TABLE "tour_attendees"`);
    await queryRunner.query(`DROP TABLE "leader_rates"`);
    await queryRunner.query(`DROP TABLE "leaders"`);
  }
}
