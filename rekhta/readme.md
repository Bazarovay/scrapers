## Set links and run index.js
node index.js

# The bash script to compile images into pdf
res=(); for ((i=0; i<=268; i++)); do res+=" "page_number$i.png;  done; convert $res arooz_ahang_aur_bayaan.pdf
