CREATE TABLE relato_inconsistencia (
    id UUID PRIMARY KEY,
    bem_id UUID NOT NULL REFERENCES bem_cultural(id) ON DELETE CASCADE,
    contato VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_relato_inconsistencia_bem ON relato_inconsistencia(bem_id);
