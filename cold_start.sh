sudo -u postgres psql -c "CREATE DATABASE mydb;"
sudo -u postgres psql -d mydb -c "CREATE TABLE Users (u_id varchar(255), createdtime varchar(255), e_type int, username varchar(255), email varchar(255), pword varchar(255), isadmin bool);"
sudo -u postgres psql -d mydb -c "CREATE TABLE Posts (u_id varchar(255), createdtime varchar(255), e_type int, p_content varchar(1024), author_id varchar(255));"