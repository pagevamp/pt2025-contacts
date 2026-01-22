export PGPASSWORD=postgres
for file in ./migrations/*.sql; 
do
psql -U stutiupreti -d db -f "$file"
done