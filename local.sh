#!/bin/bash

# Caminho para a raiz do projeto
ROOT_DIR=$(pwd)

# Função para verificar se um comando está instalado
command_exists () {
    command -v "$1" >/dev/null 2>&1 ;
}

# Verificar se o Hardhat está instalado
if ! command_exists npx ; then
    echo "npx não encontrado. Por favor, instale o Node.js e o npm primeiro."
    exit 1
fi

# Verificar se o Bun está instalado
if ! command_exists bun ; then
    echo "Bun não encontrado. Por favor, instale o Bun primeiro."
    exit 1
fi

# Função para iniciar o Hardhat Node
start_hardhat_node () {
    echo "Iniciando o Hardhat Node..."
    cd $ROOT_DIR/contracts
    npx hardhat node &
    HARDHAT_NODE_PID=$!

    echo "Esperando o Hardhat Node iniciar..."
    until curl -s http://localhost:8545/ > /dev/null; do
        sleep 1
    done
    echo "Hardhat Node está disponível."
}

# Função para fazer o deploy dos contratos
deploy_contracts () {
    echo "Fazendo deploy dos contratos..."
    cd $ROOT_DIR/contracts
    npx hardhat run scripts/deploy.ts --network localhost | tee $ROOT_DIR/deploy.log
}

# Função para capturar os endereços dos contratos e atualizar addrs.ts
update_contract_addresses () {
    echo "Atualizando endereços dos contratos no arquivo addrs.ts..."
    
    # Captura os endereços dos contratos
    REAL_ESTATE_ADDRESS=$(grep -Po '(?<=Deployed Real Estate Contract at: ).*' $ROOT_DIR/deploy.log)
    ESCROW_ADDRESS=$(grep -Po '(?<=Deployed Escrow Contract at: ).*' $ROOT_DIR/deploy.log)
    
    # Verifica se os endereços foram encontrados
    if [[ -z "$REAL_ESTATE_ADDRESS" || -z "$ESCROW_ADDRESS" ]]; then
        echo "Erro: Não foi possível encontrar os endereços dos contratos no deploy.log."
        exit 1
    fi

    # Verifica se o arquivo addrs.ts existe, se não, cria-o
    if [ ! -f $ROOT_DIR/client/src/utils/contracts/addrs.ts ]; then
        echo "Arquivo addrs.ts não encontrado, criando novo arquivo..."
        touch $ROOT_DIR/client/src/utils/contracts/addrs.ts
        echo "export const REALESTATE_CONTRACT_ADDRESS = '';" > $ROOT_DIR/client/src/utils/contracts/addrs.ts
        echo "export const ESCROW_CONTRACT_ADDRESS = '';" >> $ROOT_DIR/client/src/utils/contracts/addrs.ts
    fi

    # Atualiza os endereços no arquivo addrs.ts
    sed -i "s|export const REALESTATE_CONTRACT_ADDRESS = .*|export const REALESTATE_CONTRACT_ADDRESS = '$REAL_ESTATE_ADDRESS';|" $ROOT_DIR/client/src/utils/contracts/addrs.ts
    sed -i "s|export const ESCROW_CONTRACT_ADDRESS = .*|export const ESCROW_CONTRACT_ADDRESS = '$ESCROW_ADDRESS';|" $ROOT_DIR/client/src/utils/contracts/addrs.ts

    echo "Endereços atualizados."
}

# Função para copiar as ABIs
copy_abis () {
    echo "Copiando ABIs para o cliente..."

    # Cria o diretório de destino, se não existir
    mkdir -p $ROOT_DIR/client/src/utils/contracts/abis

    # Encontra todos os arquivos .json, excluindo os .dbg.json
    find $ROOT_DIR/contracts/artifacts/contracts -name '*.json' ! -name '*.dbg.json' | while read file; do
        # Extrai o nome do arquivo sem a extensão e sem o caminho
        filename=$(basename "$file" .json)
        
        # Extrai apenas o parâmetro "abi" e salva no novo arquivo
        jq '.abi' "$file" > "$ROOT_DIR/client/src/utils/contracts/abis/${filename}_ABI.json"
    done

    echo "ABIs copiadas e renomeadas."
}

# Função para gerar as tipagens TypeScript das ABIs
generate_typescript_types () {
    echo "Gerando tipos TypeScript das ABIs..."
    cd $ROOT_DIR/client
    bun run typechain
    cd $ROOT_DIR
}

# Função para iniciar o cliente
start_client () {
    echo "Executando lint com correções automáticas..."
    cd $ROOT_DIR/client
    bun run lint --fix
    
    echo "Iniciando o cliente..."
    cd $ROOT_DIR/client
    bun run dev &
    CLIENT_PID=$!
    cd $ROOT_DIR
}

trap cleanup SIGINT

# Função principal
main () {
    start_hardhat_node
    deploy_contracts
    update_contract_addresses
    copy_abis
    generate_typescript_types
    start_client

    echo "DApp iniciada com sucesso!"
    echo "Hardhat Node PID: $HARDHAT_NODE_PID"
    echo "Cliente PID: $CLIENT_PID"

    # Mantém o terminal aberto aguardando os processos em segundo plano
    wait $HARDHAT_NODE_PID
    wait $CLIENT_PID
}

# Executar função principal
main
