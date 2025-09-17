# # this is for a single user
# for file in ./migrations/*.sql; do
#  psql -d contactdb -f "$file"
# done

# for a case where there could be multiple users 
# instead, we write
for file in ./migrations/*.sql; 
do
psql -U stutiupreti -d contactdb -f "$file"
done