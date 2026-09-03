/**
 * fix-honey-image.mjs
 * Corrige, no Supabase, a imagem do produto "Mel Puro de Flores Silvestres",
 * cuja URL do Unsplash passou a retornar 404 e deixava o card sem foto.
 *
 * Atualiza APENAS as linhas cuja imagem_url contem o id da foto quebrada,
 * sem tocar nos demais produtos. Nao imprime credenciais.
 * Saida: %TEMP%\fix-honey.json
 */
import fs from "fs";
import path from "path";
import os from "os";

const OUT = path.join(os.tmpdir(), "fix-honey.json");

const URL_QUEBRADA_ID = "1587049352847";
const NOVA_URL =
  "https://upload.wikimedia.org/wikipedia/commons/d/da/Small_Honey_Jar_with_Honeycomb_-_51330849013.jpg";

function readEnv() {
  const raw = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

(async () => {
  const result = { ok: false };
  try {
    const env = readEnv();
    const base = env.NEXT_PUBLIC_SUPABASE_URL;
    // A escrita exige a service role key (a anon key e barrada pelas policies de RLS)
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    result.usouServiceRole = Boolean(env.SUPABASE_SERVICE_ROLE_KEY);

    const headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };

    // 1. Localiza as linhas afetadas (sintaxe PostgREST: like.*valor*)
    const buscaRes = await fetch(
      `${base}/rest/v1/produtos?select=id,nome,imagem_url&imagem_url=like.*${URL_QUEBRADA_ID}*`,
      { headers }
    );
    const afetadas = await buscaRes.json();
    result.linhasAfetadas = Array.isArray(afetadas) ? afetadas.length : 0;

    if (!Array.isArray(afetadas) || afetadas.length === 0) {
      result.ok = true;
      result.mensagem = "Nenhuma linha com a URL quebrada. Nada a corrigir.";
      fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
      return;
    }

    // 2. Atualiza apenas essas linhas
    const patchRes = await fetch(
      `${base}/rest/v1/produtos?imagem_url=like.*${URL_QUEBRADA_ID}*`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ imagem_url: NOVA_URL }),
      }
    );

    result.httpStatus = patchRes.status;
    const atualizadas = await patchRes.json();

    if (patchRes.ok && Array.isArray(atualizadas)) {
      result.ok = true;
      result.atualizados = atualizadas.map((r) => ({
        nome: r.nome,
        imagem_url: r.imagem_url,
      }));
    } else {
      result.respostaApi = atualizadas;
    }
  } catch (e) {
    result.error = e.message;
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2), "utf8");
})();
