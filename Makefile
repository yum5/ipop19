resources/network.svg: resources/network.dot
	cd resources && dot -Tsvg network.dot -o network.svg
	# Don't forget edit network.svg by Inkspace
	# Embed linking images ([Extension] -> Image -> Embed Image)
