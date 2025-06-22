commit:
	docker run --rm -v "./":/app -w /app catatsehat git commit -a -m "$(m)"

add:
	docker run --rm -v "./":/app -w /app catatsehat git add .

push:
	docker run --rm -v "./":/app -w /app catatsehat git push

