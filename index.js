export default {
  async fetch(request, env, ctx) {
    // Эта функция сработает только если пользователь запросит файл, которого нет в public_html
    return new Response("Страница не найдена", { 
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  },
};
