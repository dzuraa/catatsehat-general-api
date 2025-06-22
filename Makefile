commit:
	docker run --rm -v "./":/app -w /app catatsehat git commit -a -m "$(m)" --no-verify

add:
	docker run --rm -v "./":/app -w /app catatsehat git add .

push:
	docker run --rm -v "./":/app -w /app catatsehat git push origin $(branch)

pull:
	docker run --rm -v "./":/app -w /app catatsehat git pull --rebase origin $(branch)

