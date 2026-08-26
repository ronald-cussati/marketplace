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
  console.log("🌱 Iniciando Seed do Banco de Dados no Supabase...");

  try {
    // 1. Criar ou verificar usuário vendedor no Auth
    const vendorEmail = "produtor@feira.com";
    const vendorPassword = "senhaSegura123";

    const { data: usersList } = await supabase.auth.admin.listUsers();
    let vendorAuthUser = usersList?.users?.find((u) => u.email === vendorEmail);

    if (!vendorAuthUser) {
      console.log(`Criando usuário no Auth: ${vendorEmail}`);
      const { data: createdAuth, error: authErr } = await supabase.auth.admin.createUser({
        email: vendorEmail,
        password: vendorPassword,
        email_confirm: true,
        user_metadata: { nome: "José da Silva (Sítio Vista Linda)" },
      });

      if (authErr) {
        console.error("Erro ao criar usuário auth:", authErr);
      } else {
        vendorAuthUser = createdAuth.user;
      }
    } else {
      console.log(`Usuário auth ${vendorEmail} já existe (${vendorAuthUser.id})`);
    }

    if (!vendorAuthUser) {
      console.error("Não foi possível obter ou criar usuário auth.");
      return;
    }

    const userId = vendorAuthUser.id;

    // 2. Inserir ou atualizar na tabela usuarios
    console.log(`Garantindo registro na tabela 'usuarios' (${userId})...`);
    const { error: userTableErr } = await supabase
      .from("usuarios")
      .upsert({
        id: userId,
        nome: "José da Silva",
        tipo: "vendedor",
        telefone: "(27) 99988-7766",
      });

    if (userTableErr) {
      console.error("Erro na tabela usuarios:", userTableErr);
    }

    // 3. Inserir ou buscar vendedor na tabela vendedores
    console.log("Garantindo registro na tabela 'vendedores'...");
    let { data: existingVend } = await supabase
      .from("vendedores")
      .select("*")
      .eq("usuario_id", userId)
      .maybeSingle();

    if (!existingVend) {
      const { data: createdVend, error: vendErr } = await supabase
        .from("vendedores")
        .insert({
          usuario_id: userId,
          nome_loja: "Sítio Vista Linda — Queijaria & Orgânicos",
          descricao: "Produção familiar agroecológica de queijos artesanais curados e hortaliças frescas nas montanhas capixabas.",
          cidade: "Domingos Martins - ES",
        })
        .select()
        .single();

      if (vendErr) {
        console.error("Erro na tabela vendedores:", vendErr);
      } else {
        existingVend = createdVend;
      }
    }

    if (!existingVend) {
      console.error("Não foi possível criar o vendedor.");
      return;
    }

    const vendedorId = existingVend.id;
    console.log(`Vendedor ID configurado: ${vendedorId}`);

    // 4. Cadastrar produtos de demonstração
    console.log("Inserindo produtos da feira na tabela 'produtos'...");
    const produtosSeed = [
      {
        vendedor_id: vendedorId,
        nome: "Queijo Artesanal Meia Cura da Serra (500g)",
        descricao: "Produzido com leite cru de vacas criadas a pasto nas montanhas. Maturação de 30 dias com casca florida e textura macia.",
        preco: 38.50,
        categoria: "Queijos & Laticínios",
        estoque_qtd: 14,
        imagem_url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Mel Puro de Flores Silvestres (500g)",
        descricao: "Mel 100% puro e cru colhido em florada nativa da Mata Atlântica. Rico em antioxidantes e sabor floral suave.",
        preco: 29.90,
        categoria: "Mel & Geleias",
        estoque_qtd: 22,
        imagem_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
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
        imagem_url: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Cesto Multiuso de Fibra Natural Trançada",
        descricao: "Feito à mão por artesãs locais com taboa e palha de milho tratada. Ideal para pães, frutas ou decoração afetiva.",
        preco: 54.00,
        categoria: "Artesanato",
        estoque_qtd: 6,
        imagem_url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      },
      {
        vendedor_id: vendedorId,
        nome: "Geleia Artesanal de Morango com Pimenta Rosa",
        descricao: "Morangos frescos das montanhas cozidos lentamente em tacho de cobre com toque aromático de pimenta rosa.",
        preco: 24.50,
        categoria: "Mel & Geleias",
        estoque_qtd: 15,
        imagem_url: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
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
        imagem_url: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
        ativo: true,
      }
    ];

    for (const prod of produtosSeed) {
      const { error: prodErr } = await supabase.from("produtos").insert(prod);
      if (prodErr) {
        console.warn(`Aviso ao inserir produto ${prod.nome}:`, prodErr.message);
      } else {
        console.log(`✅ Inserido: ${prod.nome}`);
      }
    }

    console.log("✨ Seed concluído com sucesso no Supabase!");
  } catch (error) {
    console.error("Erro durante o seed:", error);
  }
}

runSeed();
