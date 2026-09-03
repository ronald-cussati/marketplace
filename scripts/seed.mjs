import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hzccqgzcttjsemshbqey.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Y2NxZ3pjdHRqc2Vtc2hicWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc3ODgwOCwiZXhwIjoyMTAzMzU0ODA4fQ.7sOKDhRkegzQrqH5voOYTc8RwOvVFdQ80j0l0b97Ufc";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runSeed() {
  console.log("🌱 Sincronizando imagens e produtos no Supabase...");

  try {
    // 1. Obter vendedor
    const { data: vendedores } = await supabase.from("vendedores").select("*").limit(1);
    if (!vendedores || vendedores.length === 0) {
      console.error("Nenhum vendedor encontrado no banco.");
      return;
    }
    const vendedorId = vendedores[0].id;

    // 2. Limpar e recadastrar produtos com as fotos corrigidas
    await supabase.from("produtos").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const produtosSeed = [
      {
        vendedor_id: vendedorId,
        nome: "Queijo Artesanal Meia Cura da Serra (500g)",
        descricao: "Produzido com leite cru de vacas criadas a pasto nas montanhas. Maturação de 30 dias com casca florida e textura macia.",
        preco: 38.50,
        categoria: "Queijos & Laticínios",
        estoque_qtd: 14,
        imagem_url: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Mel Puro de Flores Silvestres (500g)",
        descricao: "Mel 100% puro e cru colhido em florada nativa da Mata Atlântica. Rico em antioxidantes e sabor floral suave.",
        preco: 29.90,
        categoria: "Mel & Geleias",
        estoque_qtd: 22,
        imagem_url: "https://upload.wikimedia.org/wikipedia/commons/d/da/Small_Honey_Jar_with_Honeycomb_-_51330849013.jpg",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Pão Rústico Levain Multigrãos",
        descricao: "Fermentação 100% natural de 36 horas com farinha orgânica, linhaça dourada, girassol e gergelim tostado.",
        preco: 22.00,
        categoria: "Panificação & Doces",
        estoque_qtd: 8,
        imagem_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Cesta de Hortaliças Orgânicas da Estação",
        descricao: "Alface crespa, rúcula, couve manteiga, cenouras baby, rabanete e cheiro-verde recém-colhidos no dia da entrega.",
        preco: 35.00,
        categoria: "Hortifrúti",
        estoque_qtd: 12,
        imagem_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Cesto Multiuso de Fibra Natural Trançada",
        descricao: "Feito à mão por artesãs locais com taboa e palha de milho tratada. Ideal para pães, frutas ou decoração afetiva.",
        preco: 54.00,
        categoria: "Artesanato",
        estoque_qtd: 6,
        imagem_url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Geleia Artesanal de Morango com Pimenta Rosa",
        descricao: "Morangos frescos das montanhas cozidos lentamente em tacho de cobre com toque aromático de pimenta rosa.",
        preco: 24.50,
        categoria: "Mel & Geleias",
        estoque_qtd: 15,
        imagem_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Caneca de Cerâmica Terracota Esmaltada (300ml)",
        descricao: "Modelada no torno com queima em alta temperatura (1240°C). Design ergonômico e acabamento rústico exclusivo.",
        preco: 42.00,
        categoria: "Artesanato",
        estoque_qtd: 9,
        imagem_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Café Especial Arábica Torrado em Grãos (250g)",
        descricao: "Café 100% arábica cultivado a 1.100m de altitude. Notas sensoriais de caramelo, chocolate e acidez cítrica equilibrada.",
        preco: 32.00,
        categoria: "Bebidas Artesanais",
        estoque_qtd: 20,
        imagem_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      }
    ];

    for (const prod of produtosSeed) {
      const { error: prodErr } = await supabase.from("produtos").insert(prod);
      if (prodErr) {
        console.warn(`Erro ao inserir ${prod.nome}:`, prodErr.message);
      } else {
        console.log(`✅ Inserido com foto temática: ${prod.nome}`);
      }
    }

    console.log("✨ Banco de dados Supabase sincronizado com as fotos temáticas corretas!");
  } catch (error) {
    console.error("Erro durante o seed:", error);
  }
}

runSeed();
