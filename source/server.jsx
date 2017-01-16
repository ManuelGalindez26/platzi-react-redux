import http from 'http';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { IntlProvider } from 'react-intl';

import Pages from './pages/containers/Page';
import Layout from './pages/components/Layout';

import messages from './messages.json';

const domain = process.env.NODE_ENV === 'production'
  ? 'https://react-redux-platzi-sfs.now.sh'
  : 'http://localhost:3001';

function requestHandler(request, response) {
  const locale = request.headers['accept-language'].indexOf('es') >= 0 ? 'es' : 'en';
  const context = createServerRenderContext();

  let html = renderToString(
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ServerRouter location={request.url} context={context}>
        <Pages />
      </ServerRouter>
    </IntlProvider>,
  );

  const result = context.getResult();

  response.setHeader('Content-Type', 'text/html');

  if (result.redirect) {
    response.writeHead(301, {
      Location: result.redirect.pathname,
    });
  }

  if (result.missed) {
    response.writeHead(404);
    html = renderToString(
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ServerRouter location={request.url} context={context}>
          <Pages />
        </ServerRouter>
      </IntlProvider>,
    );
  }

  response.write(
    renderToStaticMarkup(
      <Layout
        title="Aplicación"
        content={html}
        domain={domain}
      />,
    ),
  );
  response.end();
}

const server = http.createServer(requestHandler);

server.listen(3000);


/*
¿Porque se hace nuevo render en la validacionde 404?

Debido a como funciona el componente Miss este requiere usar componentDidMount,
pero ya que este método no se ejecuta en el servidor entonces hay que hacer el render dos veces.

Es para evitar un posible problema al luego hacer el render en el navegador donde
React va a dar un warning en consola indicando que lo se renderiza en el cliente
es diferente al HTML generado en el servidor.

Algunas veces pasa y para evitar este problema se recomienda el doble render en caso de un 404.*/
