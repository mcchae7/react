create table users(
  id serial,
  name character varying(50),
  email character varying(50),
  password character varying(50)
);

insert into users(name, email, password)
VALUES
('Minchul Chae', 'mcchae7@gmail.com', '1092')