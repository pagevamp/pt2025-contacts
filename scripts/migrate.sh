for file in ./migrations/*.sql; 
do
psql -U stutiupreti -d contactdb -f "$file"
done