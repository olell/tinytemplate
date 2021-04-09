import os

print("Creating minified javascript")
os.system("terser --compress --mangle -- tinytemplate.js > tinytemplate.min.js")

large = os.path.getsize("tinytemplate.js")
small = os.path.getsize("tinytemplate.min.js")
print("Reduced size from %d bytes to %d bytes (%.02f%%)" % (large, small, ((large - small) / large) * 100))
