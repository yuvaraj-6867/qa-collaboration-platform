FROM ruby:3.3.0

WORKDIR /app

COPY Gemfile ./
COPY Gemfile.lock ./ 2>/dev/null || true
RUN bundle install

COPY . .

EXPOSE 3001

CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]