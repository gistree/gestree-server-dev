-- Database version 9.5.5
\echo ' ------------------- '
\echo ' ----> SyncDB <---- '
\echo ' -> version 0.0.1 <- '
\echo ' ------------------- '
\echo `date`

\set databasename 'sync_db'
\set schema 'dev'
\set owner 'postgres'

-- CREATE DATABASE
CREATE DATABASE :databasename
  WITH OWNER = :owner
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'pt_PT.UTF-8'
       LC_CTYPE = 'pt_PT.UTF-8'
       CONNECTION LIMIT = -1;

-- CONNECT TO DATABASE
\connect :databasename
\conninfo

-- DATABASE DEFAULTS
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

-- CREATE SCHEMA DEV
CREATE SCHEMA :schema;
ALTER SCHEMA :schema OWNER TO :owner;
SET search_path = :schema, 'public', pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;

-- CREATE TABLES
CREATE TABLE trees (
    id_tree integer NOT NULL,
    insert_date timestamp DEFAULT date_trunc('milliseconds', now()) NOT NULL,
    species VARCHAR(128) NOT NULL
);
ALTER TABLE trees OWNER TO :owner;

CREATE SEQUENCE trees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE trees_id_seq OWNER TO :owner;
ALTER SEQUENCE trees_id_seq OWNED BY trees.id_tree;

ALTER TABLE ONLY trees ALTER COLUMN id_tree SET DEFAULT nextval('trees_id_seq'::regclass);
SELECT pg_catalog.setval('trees_id_seq', 1, false);

ALTER TABLE ONLY trees
ADD CONSTRAINT "PK_Trees" PRIMARY KEY (id_tree);

-- CREATE TABLES
CREATE TABLE trees_log (
    id_log integer NOT NULL,
    id_tree integer NOT NULL,
    insert_date timestamp DEFAULT date_trunc('milliseconds', now()) NOT NULL,
    species VARCHAR(128) NOT NULL,
    type VARCHAR(2) NOT NULL,
);
ALTER TABLE trees_log OWNER TO :owner;

CREATE SEQUENCE trees_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE trees_log_id_seq OWNER TO :owner;
ALTER SEQUENCE trees_log_id_seq OWNED BY trees_log.id_log;

ALTER TABLE ONLY trees_log ALTER COLUMN id_log SET DEFAULT nextval('trees_log_id_seq'::regclass);
SELECT pg_catalog.setval('trees_log_id_seq', 1, false);

ALTER TABLE ONLY trees_log
ADD CONSTRAINT "PK_Trees_log" PRIMARY KEY (id_log);

CREATE OR REPLACE FUNCTION log_tree()
  RETURNS trigger AS
$BODY$
  DECLARE
BEGIN
  IF (TG_OP = 'UPDATE') THEN
        INSERT INTO trees_log (id_tree, species, type) 
        VALUES (NEW.id_tree, NEW.species, substring(TG_OP,1,1));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO trees_log (id_tree, species, type) 
        VALUES (OLD.id_tree, OLD.species, substring(TG_OP,1,1));
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO trees_log (id_tree, species, type) 
        VALUES (NEW.id_tree, NEW.species, substring(TG_OP,1,1));
        RETURN NEW;
    ELSE
        RAISE WARNING ' Other action occurred: %, at %', TG_OP, now();
        RETURN NULL;
    END IF;
RETURN NEW;
END;
$BODY$
LANGUAGE PLPGSQL;
ALTER FUNCTION log_tree() SET search_path=:schema,public;

CREATE TRIGGER log_tree
  AFTER INSERT OR UPDATE OR DELETE ON trees
  FOR EACH ROW
  EXECUTE PROCEDURE log_tree();

\d dev.trees

\echo '\n'
\echo ' ------------------- '
\echo ' ----> SyncDB <---- '
\echo ' -> version 0.0.1 <- '
\echo ' ------------------- '
\echo `date`
