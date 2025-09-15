FROM ruby:3.2-alpine

RUN apk add --no-cache build-base postgresql-dev nodejs npm

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install --without development test

COPY . .

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]