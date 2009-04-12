script_by=By 


{foreach from=$scripts key=scriptId item=s name=sfe}
{$s.id}_title={$s.name}
{$s.id}_desc={$s.description}
{/foreach}

none_title=None