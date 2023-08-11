declare -a build_dirs

build_dirs=(
  'build'
  'loader'
  'www'
  'dist'
  'dist-types'
  'stat'
  'stats'
  'built'
)

for i in "${build_dirs[@]}"
do
  find packages -type d -name $i -prune -exec rm -rf '{}' +
done